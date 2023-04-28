import { useState, useEffect } from "react";
import { Button, Container, Dimmer, Loader, Message, Dropdown, Label, Icon, Header } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import axios from 'axios';
import Help from './TreasureMappingHelp';
import UploadImage from "./utilities/UploadImage";

const mapNumberOptions = [
  { key: '1', text: '1', value: '1' },
  { key: '2', text: '2', value: '2' },
  { key: '3', text: '3', value: '3' },
  { key: '4', text: '4', value: '4' },
  { key: '5', text: '5', value: '5' },
  { key: '6', text: '6', value: '6' },
  { key: '7', text: '7', value: '7' },
  { key: '8', text: '8', value: '8' },
]

const TreasureMapping = () => {
  const [imageFile, setImageFile] = useState();
  const [imageExtention, setImageExtention] = useState();
  const [treasurePosition, setTrasurePotision] = useState();
  const [screenError, setScreenError] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [positionRegistered, setPositionRegistered] = useState(false);

  //選択した画像の状態が変わる(nullを含む)と他の状態も初期化する
  useEffect(() => {
    setImageExtention();
    setTrasurePotision();
    setScreenError();
    setIsProcessing(false);
    setPositionRegistered(false);
  }, [imageFile])

  const getBase64Image = () => {
    //正規表現を()でくくるとキャプチャグループとなり、その部分が戻り値配列の[1]移行の要素として設定される
    //matches[0]がマッチした文字列全体、[1]が一つ目のキャプチャグループ(拡張子)、[2]が2つめのキャプチャグループ(base64内容)
    const matches = imageFile.match(/^data:\w+\/(\w+);base64,(.*)$/);
    return [matches[1], matches[2]];
  }

  const identifyTreasurePosition = () => {
    setIsProcessing(true);
    setTrasurePotision();
    let tmpImageExtention, image64Content;
    [tmpImageExtention, image64Content] = getBase64Image();
    setImageExtention(tmpImageExtention);

    axios.post('https://bh64vjmz22.execute-api.ap-northeast-1.amazonaws.com/stage/g15',
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

  const registerPosition = (e, data) => {
    setIsProcessing(true);
    axios.post('https://bh64vjmz22.execute-api.ap-northeast-1.amazonaws.com/stage/registerposition',
      {
        filename: treasurePosition.requestId + '.' + imageExtention,
        category: 'G15',
        location: 'エルピス',
        number: String(data.value)
      }
    )
      .then(() => {
        setPositionRegistered(true);
        setIsProcessing(false);
      })
      .catch((error) => {
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
          <p>{screenError.message}</p>
        </Message>
        : null}

      {imageFile ?
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <img className="image-preview" src={imageFile} alt="アップロードした画像のプレビュー" />
          <Button className="reset-button" onClick={() => setImageFile(null)}>画像を選び直す</Button>
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
            setImageFile={(imageFile) => setImageFile(imageFile)}
            setScreenError={(error) => setScreenError(error)}
          />
          <Link to="/treasuremapping/offer" className="link-message">
            <Button color="teal" size="big">
              画像提供はこちら<Icon name='angle double right' />
            </Button>
          </Link>
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
            {
              positionRegistered
                ? <div className="gaming map-number-dropdown">Thank you!!</div>
                :
                <Dropdown
                  placeholder="データ収集のため、正解の番号を選択してください🤗"
                  selection
                  options={mapNumberOptions}
                  className="map-number-dropdown"
                  onChange={registerPosition}
                  disabled={positionRegistered}
                  clearable
                  //下記は何も選択しない際に1つ目のオプションが選択されるのを防止するため
                  selectOnBlur={false}
                />
            }
            <img className="map-overview" src="/treasuremapping/overview_g15.png" alt="全体の地図" />
          </div>
        </motion.div>
        : null}
    </>
  )
}

export default TreasureMapping