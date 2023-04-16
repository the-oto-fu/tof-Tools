import { useState, useRef, useEffect } from "react";
import { Button, Container, Dimmer, Loader, Message, Dropdown, Label, Icon, Segment, Header } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import axios from 'axios';
import Camera from './utilities/Camera';

let reader = new FileReader();

const mapNumberOptions = [
  { key: '1', text: '1', value: '1' },
  { key: '2', text: '2', value: '2' },
  { key: '3', text: '3', value: '3' },
  { key: '4', text: '4', value: '4' },
  { key: '5', text: '5', value: '5' },
  { key: '6', text: '6', value: '6' },
  { key: '7', text: '7', value: '7' },
  { key: '8', text: '8', value: '8' }
]

const TreasureMapping = () => {
  const [imageFile, setImageFile] = useState();
  const [treasurePosition, setTrasurePotision] = useState();
  const [screenError, setScreenError] = useState();
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  //引数のblob画像をデータURL形式にしてStateにセットする
  const ReadImageAsURL = async (imageFile) => {
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      setImageFile(reader.result);
    };
  }

  useEffect(() => {
    //画面に対するペーストのイベント
    window.addEventListener("paste", (e) => {
      let items = Array.from(e.clipboardData.items);
      let item = items.find(x => /^image\//.test(x.type));
      if (item) {
        let image = item.getAsFile();
        setTrasurePotision(null);
        ReadImageAsURL(image);
      }
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

  useEffect(() => {
    if (acceptedFiles.length) {
      setTrasurePotision(null);
      ReadImageAsURL(acceptedFiles[0]);
    }
  }, [acceptedFiles])

  const imageFileinputRef = useRef();
  const handleClickImageSelect = () => {
    imageFileinputRef.current.click();
  }

  const cameraOn = () => {
    setIsCameraOn(true);
  }

  const cameraOff = () => {
    setIsCameraOn(false);
  }

  const initTreasure = () => {
    setImageFile();
    setTrasurePotision();
    setScreenError();
    setIsAnalysing(false);
    setIsCameraOn(false);
  }

  const handleChangeImageFileInput = (e) => {
    ReadImageAsURL(e.target.files[0]);
  }

  const getBase64Image = () => {
    //正規表現を()でくくるとキャプチャグループとなり、その部分が戻り値配列の[1]移行の要素として設定される
    //matches[0]がマッチした文字列全体、[1]が一つ目のキャプチャグループ(拡張子)、[2]が2つめのキャプチャグループ(base64内容)
    const matches = imageFile.match(/^data:\w+\/(\w+);base64,(.*)$/);
    return [matches[1], matches[2]];
  }

  const identifyTreasurePosition = () => {
    setIsAnalysing(true);
    setTrasurePotision();
    let imageExtention, image64Content;
    [imageExtention, image64Content] = getBase64Image();
    axios.post('https://8i7ttdp7w5.execute-api.ap-northeast-1.amazonaws.com/stage/g15',
      {
        mapImage: image64Content,
        imageExtention: imageExtention
      }
    )
      .then((response) => {
        setTrasurePotision(response.data);
        setIsAnalysing(false);
      })
      .catch((error) => {
        setIsAnalysing(false);
        setScreenError(error);
      });
  }

  return (
    <>
      {screenError ?
        <Message negative>
          <Message.Header>エラーが発生しました。再操作をお願いします…😌</Message.Header>
          <p>{screenError.message}</p>
        </Message>
        : null}

      {isCameraOn ?
        <Camera setImageFile={(imagefile) => setImageFile(imagefile)}
          cameraOff={() => cameraOff()}
          setScreenError={(error) => setScreenError(error)}
        />
        : null}

      {imageFile ?
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <img className="image-preview" src={imageFile} />
          <Container>
            {
              treasurePosition 
              ? null 
              : <Button onClick={identifyTreasurePosition}>座標を特定!</Button>
            }
            <Button onClick={initTreasure}>画像を選び直す</Button>
          </Container>
        </motion.div>
        :
        <Container className="information">
          <motion.div {...getRootProps({ className: 'dropzone' })}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <input
              {...getInputProps()}
              type="file"
              id="inputfile"
              accept=".png,.jpg,.jpeg"
              ref={imageFileinputRef}
              onChange={(e) => handleChangeImageFileInput(e)}
            />
            <Segment placeholder onClick={handleClickImageSelect}>
              <Header icon>
                <Icon name='picture' />
                クリックまたはドラッグ&ドロップもしくはカメラから
              </Header>
              G15画像を指定してください<br />
              キャプチャ画像をそのままCtrl + VしてもOK
            </Segment>
            <Button onClick={cameraOn}>カメラから(スマホ向け)</Button>
          </motion.div>
        </Container>
      }

      {isAnalysing
        ? <Dimmer active inverted><Loader>座標特定中…</Loader></Dimmer>
        : null}
      {treasurePosition != null ?
        <motion.div
          initial={{ y: "100vh" }}
          animate={{
            y: "0",
            transitionEnd: {
              transform: "none"
            }
          }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          <Container className="identify-result-container">
            <Label color="pink" size="big">
              【{treasurePosition.mapNumber}】{treasurePosition.position}
            </Label>
            <Dropdown
              placeholder='データ収集のため、正解の番号を選択していただけると助かります🤗'
              selection
              options={mapNumberOptions}
              className="map-number-dropdown"
            />
            <img className="map-overview" src="/treasuremapping/overview_g15.png" />
          </Container>
        </motion.div>
        : null}
    </>
  )
}

export default TreasureMapping