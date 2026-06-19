import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Download, X } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { useEffect, useRef, useState, useCallback } from 'react';
import './ARTryOn.css';

const MODELS_BASE = '/models/';

const PRODUCTS_BY_MODE = {
  necklace: [
    { id: 'neck4', src: '/products/neck4.png' },
    { id: 'neck3', src: '/products/neck3.png' },
    { id: 'neck2', src: '/products/neck2.png' },
    { id: 'neck1', src: '/products/neck1.png' },
  ],
  earrings: [
    { id: 'ear9', src: '/products/ear9.png' },
    { id: 'ear7', src: '/products/ear7.png' },
    { id: 'ear5', src: '/products/ear5.png' },
    { id: 'ear6', src: '/products/ear6.png' },
  ],
};

const ID_TO_JEWELRY = {
  1: 'ear9', 2: 'ear7', 3: 'ear5', 4: 'ear6',
  5: 'neck1', 6: 'neck2', 7: 'neck3', 8: 'neck4',
};

export default function ARTryOn() {
  const { category, productId } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === Number(productId));

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const jewelryImgRef = useRef(new Image());
  const faceBoxRef = useRef(null);
  const detectLockRef = useRef(false);
  const lastDetectRef = useRef(0);
  const detectorReadyRef = useRef(false);
  const cameraReadyRef = useRef(false);
  const isRunningRef = useRef(false);
  const modeRef = useRef('necklace');

  const initialMode = category === 'earring' ? 'earrings' : 'necklace';
  const initialId = product ? (ID_TO_JEWELRY[Number(productId)] || PRODUCTS_BY_MODE[initialMode][2].id) : PRODUCTS_BY_MODE[initialMode][2].id;

  const [mode, setMode] = useState(initialMode);
  const [activeId, setActiveId] = useState(initialId);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Loading camera...');
  const [capturedDataUrl, setCapturedDataUrl] = useState(null);
  const [faceapiReady, setFaceapiReady] = useState(false);

  modeRef.current = mode;
  isRunningRef.current = isRunning;

  const updateStatus = useCallback((msg) => {
    setStatus(msg);
  }, []);

  const detectFace = useCallback(async (video) => {
    detectLockRef.current = true;
    try {
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 });
      const result = await faceapi.detectSingleFace(video, options);
      faceBoxRef.current = result ? result.box : null;
    } catch (e) {
      console.warn('Detection error:', e);
    }
    detectLockRef.current = false;
  }, []);

  const drawJewelry = useCallback((ctx, cw, ch, vw, vh) => {
    const box = faceBoxRef.current;
    if (!box) return;

    const fw = box.width * (cw / vw);
    const fh = box.height * (ch / vh);
    const fx = box.x * (cw / vw);
    const fy = box.y * (ch / vh);
    const mx = cw - fx - fw;

    if (modeRef.current === 'necklace') {
      const img = jewelryImgRef.current;
      const aspect = img.naturalHeight / img.naturalWidth;
      const neckW = fw * 1.2;
      const neckH = neckW * aspect;
      const cx = mx + fw / 2;
      const x = cx - neckW / 2 - 12;
      const y = fy + fh * 0.92;
      ctx.drawImage(img, x, y, neckW, neckH);
    } else {
      const img = jewelryImgRef.current;
      const aspect = img.naturalWidth / img.naturalHeight;
      const earH = fh / 3;
      const earW = earH * aspect;

      const leftX = mx - earW * 0.5;
      const leftY = fy + fh * 0.48;
      ctx.drawImage(img, leftX, leftY, earW, earH);

      const rightX = mx + fw - earW * 0.5;
      const rightY = fy + fh * 0.48;
      ctx.drawImage(img, rightX, rightY, earW, earH);
    }
  }, []);

  const previewLoop = useCallback((video, canvas, ctx) => {
    const loop = () => {
      if (!cameraReadyRef.current) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.save();
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, w, h);
      }
      ctx.restore();

      const now = performance.now();
      if (isRunningRef.current && now - lastDetectRef.current > 100 && !detectLockRef.current) {
        lastDetectRef.current = now;
        detectFace(video);
      }

      if (faceBoxRef.current && jewelryImgRef.current.complete && jewelryImgRef.current.naturalWidth > 0) {
        drawJewelry(ctx, w, h, video.videoWidth || w, video.videoHeight || h);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };
    loop();
  }, [detectFace, drawJewelry]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
    script.async = true;
    script.onload = () => setFaceapiReady(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    if (!faceapiReady) return;
    const init = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      const ctx = canvas.getContext('2d');

      try {
        updateStatus('Requesting camera...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        video.srcObject = stream;
        streamRef.current = stream;

        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            resolve();
          };
          video.play();
          if (video.readyState >= 2) {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            resolve();
          }
        });

        cameraReadyRef.current = true;
        updateStatus('Loading face detector...');

        await faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_BASE);
        detectorReadyRef.current = true;

        updateStatus('Ready — press Start Try-On');
        previewLoop(video, canvas, ctx);
      } catch (err) {
        console.error('Init error:', err);
        updateStatus('Error: ' + err.message);
      }
    };
    init();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [faceapiReady, updateStatus, previewLoop]);

  useEffect(() => {
    const all = PRODUCTS_BY_MODE[mode];
    const found = all.find(p => p.id === activeId) || all[0];
    const img = new Image();
    img.onload = () => { jewelryImgRef.current = img; };
    img.src = found.src;
  }, [activeId, mode]);

  const toggleTryOn = () => {
    if (!detectorReadyRef.current) { updateStatus('Face detector not ready'); return; }
    if (!cameraReadyRef.current) { updateStatus('Camera not ready'); return; }

    const next = !isRunning;
    isRunningRef.current = next;
    setIsRunning(next);
    if (!next) {
      faceBoxRef.current = null;
      updateStatus('Paused');
    } else {
      updateStatus('Detecting...');
    }
  };

  const handleCapture = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedDataUrl(dataUrl);
  };

  const handleDownload = () => {
    if (!capturedDataUrl) return;
    const a = document.createElement('a');
    a.href = capturedDataUrl;
    a.download = `try-on-${mode}-${activeId}-${Date.now()}.png`;
    a.click();
  };

  const closePreview = () => {
    setCapturedDataUrl(null);
  };

  const selectProduct = (id) => {
    setActiveId(id);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    modeRef.current = newMode;
    const all = PRODUCTS_BY_MODE[newMode];
    setActiveId(all[0].id);
  };

  const handleBack = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    navigate(product ? `/product/${product.id}` : '/catalog');
  };

  return (
    <div className="artryon-page">
      <div className="artryon-header">
        <button className="artryon-back" onClick={handleBack}>
          <ArrowLeft size={18} />
        </button>
        <span className="artryon-title">Virtual Try-On</span>
        {product && <span className="artryon-product-name">{product.name}</span>}
        <div className="artryon-header-spacer" />
      </div>

      <div className="artryon-viewport">
        <video ref={videoRef} className="artryon-video" playsInline autoPlay muted />
        <div className="artryon-silhouette-bg" />
        <canvas ref={canvasRef} className="artryon-canvas" />

        <svg className="artryon-silhouette" viewBox="0 0 260 340" preserveAspectRatio="xMidYMin meet">
          <defs>
            <mask id="silhouette-canvas-mask" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill="black" />
              <path d="M 0.5 0.004 C 0.6846 0.004, 0.8 0.06, 0.8077 0.13 C 0.8154 0.184, 0.7769 0.224, 0.7462 0.252 C 0.7308 0.268, 0.7385 0.284, 0.7769 0.3 C 0.8538 0.316, 0.9 0.336, 0.9231 0.36 C 0.9615 0.392, 0.9846 0.436, 0.9923 0.49 L 0.9923 1 L 0.0077 1 L 0.0077 0.49 C 0.0154 0.436, 0.0385 0.392, 0.0769 0.36 C 0.1 0.336, 0.1462 0.316, 0.2231 0.3 C 0.2615 0.284, 0.2692 0.268, 0.2462 0.252 C 0.2231 0.224, 0.1846 0.184, 0.1923 0.13 C 0.2 0.06, 0.3154 0.004, 0.5 0.004 Z" fill="white" />
            </mask>
            <mask id="silhouette-bg-mask" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill="black" />
              <path d="M 0.5 0.004 C 0.6846 0.004, 0.8 0.06, 0.8077 0.13 C 0.8154 0.184, 0.7769 0.224, 0.7462 0.252 C 0.7308 0.268, 0.7385 0.284, 0.7769 0.3 C 0.8538 0.316, 0.9 0.336, 0.9231 0.36 C 0.9615 0.392, 0.9846 0.436, 0.9923 0.49 L 0.9923 1 L 0.0077 1 L 0.0077 0.49 C 0.0154 0.436, 0.0385 0.392, 0.0769 0.36 C 0.1 0.336, 0.1462 0.316, 0.2231 0.3 C 0.2615 0.284, 0.2692 0.268, 0.2462 0.252 C 0.2231 0.224, 0.1846 0.184, 0.1923 0.13 C 0.2 0.06, 0.3154 0.004, 0.5 0.004 Z" fill="white" transform="translate(0.5, 0.5) scale(1.06) translate(-0.5, -0.5)" />
            </mask>
          </defs>
          <g className="artryon-silhouette-guides">
            <path
              className="artryon-silhouette-outline"
              d="M 130 2
                 C 178 2, 208 30, 210 65
                 C 212 92, 202 112, 194 126
                 C 190 134, 192 142, 202 150
                 C 222 158, 234 168, 240 180
                 C 250 196, 256 218, 258 245
                  L 258 500
                 L 2 500
                 L 2 245
                 C 4 218, 10 196, 20 180
                 C 26 168, 38 158, 58 150
                 C 68 142, 70 134, 64 126
                 C 58 112, 48 92, 50 65
                 C 52 30, 82 2, 130 2 Z"
            />
            <line className="artryon-silhouette-guide" x1="130" y1="37" x2="130" y2="217" />
            <line className="artryon-silhouette-guide artryon-silhouette-eye-line" x1="70" y1="47" x2="190" y2="47" />
            <circle className="artryon-silhouette-guide" cx="78" cy="47" r="3" />
            <circle className="artryon-silhouette-guide" cx="182" cy="47" r="3" />
          </g>
        </svg>

        <div className="artryon-guide-text">
          <p className="artryon-guide-heading">Align your face with the outline</p>
          <p>Move your head left or right for a better view of earrings</p>
          <p>Tilt your head up or down for the best view</p>
          <p>Make sure your face is well-lit</p>
        </div>

        <div className="artryon-status">{status}</div>

        {capturedDataUrl && (
          <div className="artryon-preview-overlay">
            <div className="artryon-preview-card">
              <button className="artryon-preview-close" onClick={closePreview}>
                <X size={20} />
              </button>
              <img src={capturedDataUrl} alt="Captured try-on" className="artryon-preview-img" />
              <div className="artryon-preview-actions">
                <button className="artryon-preview-btn artryon-preview-btn-download" onClick={handleDownload}>
                  <Download size={16} /> Download Photo
                </button>
                <button className="artryon-preview-btn artryon-preview-btn-retake" onClick={closePreview}>
                  <Camera size={16} /> Retake
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="artryon-controls">
        <div className="artryon-mode-selector">
          <button
            className={`artryon-mode-btn${mode === 'necklace' ? ' active' : ''}`}
            onClick={() => changeMode('necklace')}
          >
            Necklaces
          </button>
          <button
            className={`artryon-mode-btn${mode === 'earrings' ? ' active' : ''}`}
            onClick={() => changeMode('earrings')}
          >
            Earrings
          </button>
        </div>

        <div className="artryon-product-selector">
          {PRODUCTS_BY_MODE[mode].map(p => (
            <div
              key={p.id}
              className={`artryon-thumb${activeId === p.id ? ' active' : ''}`}
              onClick={() => selectProduct(p.id)}
            >
              <img src={p.src} alt={p.id} />
            </div>
          ))}
        </div>

        <div className="artryon-actions">
          <button
            className={`artryon-btn artryon-btn-toggle${isRunning ? ' is-active' : ''}`}
            onClick={toggleTryOn}
          >
            {isRunning ? 'Stop' : 'Start Try-On'}
          </button>
          <button
            className="artryon-btn artryon-btn-capture"
            onClick={handleCapture}
            disabled={!detectorReadyRef.current}
          >
            <Camera size={16} /> Capture
          </button>
        </div>
      </div>
    </div>
  );
}
