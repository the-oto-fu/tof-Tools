import { useState, useRef, useCallback, useEffect } from 'react'
import { Icon, Dimmer } from 'semantic-ui-react'
import { Constants } from '../../common/constants'

type propsType = {
  liftUpImageFile: (newImageFile: string) => void,
  liftUpScreenError: (error: Error) => void,
  cameraOff: () => void
};

const Camera = (props: propsType) => {

  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const getUserMedia = async () => {
      //メディアストリームの取得リクエスト
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "environment"
        }
      })
        .then((tmpStream) => {
          setStream(tmpStream);
        }
        )
        .catch((e) => {
          props.cameraOff();
          props.liftUpScreenError(e);
        })
    };
    getUserMedia();
  }, []);

  const cancel = () => {
    if (!stream) return;
    stream.getVideoTracks().map(track => track.stop());
    setStream(null);
    props.cameraOff();
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  //Callback Ref: Refで対応した要素がマウント、更新、アンマウントされた時に関数が実行される
  //要素がレンダリングされているかどうかに関わらず要素の状態を取得・操作することができる
  //Callback Ref を使用すると ref の要素は useCallback の関数内で node として割り当てられるため、
  //外の関数で使用することが出来ない。そのためvideoRefにnodeを渡し、videoRefを外の関数で使用する。
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const callbackVideoRef = useCallback((node: HTMLVideoElement) => {
    if (node) {
      node.srcObject = stream;
      //以下のmuted, playsinlineがないとiOSのカメラが動かない。videoに直接属性を追加してもダメだった
      node.setAttribute('muted', '');
      node.setAttribute('playsinline', '');

    }
    videoRef.current = node;
  }, [stream])

  const takepicture = async () => {
    if (!(canvasRef.current && stream)) {
      return
    }
    const context = canvasRef.current.getContext("2d");
    if (context && videoRef.current) {
      //drawImageは現在の要素の大きさではなく要素の元の大きさ（解像度）に対して行われる
      //解像度に対して開始点や幅を指定する必要がある
      let videoWidth = stream.getVideoTracks()[0].getSettings().width as number;
      context.drawImage(videoRef.current, videoWidth * 0.1, 0, videoWidth * 0.8, videoWidth * 0.64, 0, 0, 300, 240);
      props.liftUpImageFile(canvasRef.current.toDataURL("image/png"));
    }
    cancel();
  }

  return (
    <Dimmer active page>
      <div className='camera'>
        {stream ? (
          <>
            <video
              autoPlay
              ref={callbackVideoRef}
            />
            <div className='control-ui'>
              <div className="capture-frame"></div>
              <Icon name="cancel" size="huge" circular inverted className='cancel-button' onClick={cancel} />
              <Icon name="camera" size="huge" circular inverted color='green' className='shutter-button' onClick={takepicture} />
            </div>
          </>
        ) : null}
        <canvas width={300} height={240} ref={canvasRef} hidden />
      </div>
    </Dimmer>
  );
}

export default Camera