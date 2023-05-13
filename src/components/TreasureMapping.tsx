import { useState, useEffect } from "react"
import { Button, Container, Dimmer, Loader, Message, Label, Icon, Header } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Constants } from '../common/constants'
import { getBase64Image } from '../common/functions'
import Help from './TreasureMappingHelp'
import UploadImage from './utilities/UploadImage'
import { OpacityMotion, SpringUpMotion } from './utilities/Motion'

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

  //選択した画像の状態が変わる(null初期化を含む)と他の状態も初期化する
  useEffect(() => {
    setTrasurePotision(null);
    setScreenError(null);
    setIsProcessing(false);
  }, [imageFile])

  const identifyTreasurePosition = () => {
    setIsProcessing(true);
    setTrasurePotision(null);
    const [tmpImageExtention, image64Content] = getBase64Image(imageFile);

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
        <OpacityMotion>
          <img className="image-preview" src={imageFile} alt="アップロードした画像のプレビュー" />
          <Button className="reset-button" onClick={() => setImageFile('')}>画像を選び直す</Button>
          {treasurePosition
            ?
            null
            :
            <Button color='green' onClick={identifyTreasurePosition}>座標を特定!</Button>
          }
        </OpacityMotion>
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
        <SpringUpMotion>
          <div>この地図の座標は…</div>
          <Label color="pink" size="big" tag>
            【{treasurePosition.mapNumber}】{treasurePosition.position}
          </Label>
          <div className="overview-container">
          <img className="map-overview" src="/treasuremapping/overview_g15.png" alt="全体の地図" />
          </div>
        </SpringUpMotion>
        : null}
    </>
  )
}

export default TreasureMapping