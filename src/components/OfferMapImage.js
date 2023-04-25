import { useState, useEffect } from "react";
import { Button, Container, Dropdown, Header, Dimmer, Loader } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import axios from 'axios';
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

const OfferMapImage = () => {

    const [imageFile, setImageFile] = useState();
    const [positionRegistered, setPositionRegistered] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    //選択した画像の状態が変わる(nullを含む)と他の状態も初期化する
    useEffect(() => {
        setPositionRegistered(false);
    }, [imageFile])

    const getBase64Image = () => {
        //正規表現を()でくくるとキャプチャグループとなり、その部分が戻り値配列の[1]移行の要素として設定される
        //matches[0]がマッチした文字列全体、[1]が一つ目のキャプチャグループ(拡張子)、[2]が2つめのキャプチャグループ(base64内容)
        const matches = imageFile.match(/^data:\w+\/(\w+);base64,(.*)$/);
        return [matches[1], matches[2]];
    }

    const registerMapImage = (e, data) => {
        setIsProcessing(true);

        let tmpImageExtention, image64Content;
        [tmpImageExtention, image64Content] = getBase64Image();

        axios.post('https://bh64vjmz22.execute-api.ap-northeast-1.amazonaws.com/stage/offermapimage',
            {
                mapImage: image64Content,
                imageExtention: tmpImageExtention,
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
           });
        setPositionRegistered(true);
    }

    return (
        <>
            {isProcessing
                ? <Dimmer active inverted><Loader>処理中…</Loader></Dimmer>
                : null}
            <Header as='h1'>画像提供ページ{'<G15>'}</Header>
            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {imageFile ?
                    <>
                        <img className="image-preview" src={imageFile} />
                        <Button className="reset-button" onClick={() => setImageFile(null)}>画像を選び直す</Button>
                        {positionRegistered ?
                            <div className="gaming inlinethanks">Thank you!!</div>
                            :
                            <Dropdown
                                placeholder="提供する地図の番号を選択してください"
                                selection
                                options={mapNumberOptions}
                                onChange={registerMapImage}
                                disabled={positionRegistered}
                                clearable
                                //下記は何も選択しない際に1つ目のオプションが選択されるのを防止するため
                                selectOnBlur={false}
                            />
                        }
                    </>
                    :
                    <Container>
                        <UploadImage
                            setImageFile={(imageFile) => setImageFile(imageFile)}
                        />
                    </Container>
                }
                <div className="overview-container">
                    <img className="map-overview" src="/treasuremapping/overview_g15.png" />
                </div>
            </motion.div>
        </>
    )
}

export default OfferMapImage