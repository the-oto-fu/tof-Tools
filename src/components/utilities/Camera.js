import { useState, useRef, useCallback, useEffect } from 'react'
import { Button, Message } from 'semantic-ui-react'

const Camera = (props) => {

  const [stream, setStream] = useState(null);
  const [streamError, setStreamError] = useState(null);
  
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        //メディアストリームの取得リクエスト
        navigator.mediaDevices.getUserMedia({ audio: false, video: true })
          .then((tmpStream) => {
            setStream(tmpStream);
          }
          )
      } catch (e) {
        setStreamError(e);
      }
      return { stream, error: streamError };
    };

    getUserMedia();
  }, []);

  const cancel = () => {
    if (!stream) return;
    stream.getVideoTracks().map(track => track.stop());
    setStream(null);
    props.cameraOff();
  };

  const canvasRef = useRef();

  //Callback Ref: Refで対応した要素がマウント、更新、アンマウントされた時に関数が実行される
  //要素がレンダリングされているかどうかに関わらず要素の状態を取得・操作することができる
  //Callback Ref を使用すると ref の要素は useCallback の関数内で node として割り当てられるため、
  //外の関数で使用することが出来ない。そのためvideoRefにnodeを渡し、videoRefを外の関数で使用する。
  const videoRef = useRef();
  const callbackVideoRef = useCallback((node) => {
    if (node) {
      node.srcObject = stream;
    }
    videoRef.current = node;
  })

  const takepicture = () => {
    const context = canvasRef.getContext("2d");
    canvasRef.width = 300;
    canvasRef.height = 300;
    context.drawImage(videoRef.current, 0, 0, 300, 300);
    const data = canvasRef.toDataURL("image/png");
  }

  return (
    <div className="camera-capture">
      {streamError ? (
        <Message negative>
          <Message.Header>カメラの起動でエラーが発生しました</Message.Header>
          <p>{streamError.message}</p>
        </Message>
      ) : null}
      <h1>Hello GetUserMedia</h1>
      <canvas id="canvas" ref={canvasRef}> </canvas>
      {stream ? (
        <>
          <Button onClick={() => cancel()}>カメラ終了</Button>
          <video
            autoPlay
            ref={callbackVideoRef}
          />
        </>
      ) : null}
    </div>
  );
}

export default Camera