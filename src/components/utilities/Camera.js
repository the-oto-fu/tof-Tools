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
  }, [stream])

  const takepicture = () => {
    const context = canvasRef.current.getContext("2d");
    canvasRef.current.width = 300;
    canvasRef.current.height = 300;
    context.drawImage(videoRef.current, 0, 0, 300, 300, 0, 0, 300, 300);
    cancel();
    props.setImageFile(canvasRef.current.toDataURL("image/png"));
  }

  return (
    <div className="camera">
      {streamError ? (
        <Message negative>
          <Message.Header>カメラの起動でエラーが発生しました</Message.Header>
          <p>{streamError.message}</p>
        </Message>
      ) : null}
      {stream ? (
        <>
          <Button onClick={cancel}>カメラ終了</Button>
          <Button onClick={takepicture}>画像キャプチャ</Button>
          <video
            autoPlay
            ref={callbackVideoRef}
          />
          <div className="capture-frame"></div>
        </>
      ) : null}
      <canvas id="canvas" ref={canvasRef} hidden />
    </div>
  );
}

export default Camera