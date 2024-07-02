import { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Portal = ({ children, zIndex = 1000 }) => {
  const modalRoot = document.getElementById('modal-root');
  const el = document.createElement('div');
  el.style.zIndex = zIndex;

  useEffect(() => {
    modalRoot.appendChild(el);
    return () => {
      modalRoot.removeChild(el);
    };
  }, [el, modalRoot]);

  return ReactDOM.createPortal(children, el);
};

export default Portal;