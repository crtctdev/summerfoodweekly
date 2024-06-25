import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignatureField = ({ setSignature}) => {
  const sigCanvas = useRef({});

  // Function to clear the signature canvas
  const clear = () => {
    sigCanvas.current.clear();
    setSignature("")
  };

  // Function to save the signature to your state
  const updateSignature = () => {
    if (sigCanvas.current) {
      setSignature(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  return (
    <div className="site-details-input">
      <SignatureCanvas
        ref={sigCanvas}
        penColor='black'
        onEnd={updateSignature}
        canvasProps={{
          width: 500,
          height: 200,
          className: 'signatureCanvas'
        }}
      />
      <button onClick={clear}>Clear Signature</button>
    </div>
  );
};

export default SignatureField;
