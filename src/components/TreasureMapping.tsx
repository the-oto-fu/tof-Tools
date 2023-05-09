import { useState, useEffect } from "react";
import { Button, Container, Dimmer, Loader, Message, Label, Icon, Header } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Constants } from '../config/constants'
import Help from './TreasureMappingHelp';
import UploadImage from "./utilities/UploadImage";

const TreasureMapping = () => {
  const [imageFile, setImageFile] = useState('');
  const [treasurePosition, setTrasurePotision] = useState<Constants.ObjectType.TreasuremappingResponse | null>(null);
  const [screenError, setScreenError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const liftUpImageFile = (newImageFile: string) => {
    setImageFile(newImageFile);
  }

  const liftUpScreenError = (newScreenError: Error) => {
    setScreenError(newScreenError);
  }

  const navigate = useNavigate();

  //選択した画像の状態が変わる(nullを含む)と他の状態も初期化する
  useEffect(() => {
    setTrasurePotision(null);
    setScreenError(null);
    setIsProcessing(false);
  }, [imageFile])

  const getBase64Image = () => {
    if (imageFile) {
      //正規表現を()でくくるとキャプチャグループとなり、その部分が戻り値配列の[1]移行の要素として設定される
      //matches[0]がマッチした文字列全体、[1]が一つ目のキャプチャグループ(拡張子)、[2]が2つめのキャプチャグループ(base64内容)
      const matches = imageFile.match(/^data:\w+\/(\w+);base64,(.*)$/);
      if (matches && matches.length >= 2) {
        return [matches[1], matches[2]];
      }
    }
    //TODO: error throw
    return ['', ''];
  }

  const identifyTreasurePosition = () => {
    setIsProcessing(true);
    setTrasurePotision(null);
    const [tmpImageExtention, image64Content] = getBase64Image();

    axios.post(Constants.ApiEndpoint.FF14.G15,
      {
        mapImage: image64Content,
        imageExtention: tmpImageExtention
      }
    )
      .then((response) => {
        setTrasurePotision(response.data);
        setIsProcessing(false);
      })
      .catch((error) => {
        setIsProcessing(false);
        setScreenError(error);
      });
  }

  return (
    <>
      <Header as='h1'>宝の地図座標特定{'<G15>'}</Header>
      <Help />
      {screenError ?
        <Message negative>
          <Message.Header>エラーが発生しました。再操作をお願いします…😌</Message.Header>
          <p>{screenError.name} : {screenError.message}</p>
        </Message>
        : null}

      {imageFile ?
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <img className="image-preview" src={imageFile} alt="アップロードした画像のプレビュー" />
          <Button className="reset-button" onClick={() => setImageFile('')}>画像を選び直す</Button>
          {treasurePosition
            ?
            null
            :
            <Button color='green' onClick={identifyTreasurePosition}>座標を特定!</Button>
          }
        </motion.div>
        :
        <Container>
          <UploadImage
            liftUpImageFile={(newImageFile) => liftUpImageFile(newImageFile)}
            liftUpScreenError={(error) => liftUpScreenError(error)}
          />
            <Button color="teal" size="big" onClick={() => navigate(Constants.ScreenPath.OFFER_IMAGE)}>
              画像提供はこちら<Icon name='angle double right' />
            </Button>
        </Container>
      }

      {isProcessing
        ? <Dimmer active inverted><Loader>処理中…</Loader></Dimmer>
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
          <div>この地図の座標は…</div>
          <Label color="pink" size="big" tag>
            【{treasurePosition.mapNumber}】{treasurePosition.position}
          </Label>
          <div className="overview-container">
          <img className="map-overview" src="/treasuremapping/overview_g15.png" alt="全体の地図" />
          </div>
        </motion.div>
        : null}
    </>
  )
}

export default TreasureMapping