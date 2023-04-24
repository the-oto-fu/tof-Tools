import { useState } from "react";
import { Button, Container, Message, Dropdown, Icon, Header } from 'semantic-ui-react'
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
    const [screenError, setScreenError] = useState();
    const [positionRegistered, setPositionRegistered] = useState(false);

    return (
        <>
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
                        <Dropdown
                            placeholder="提供する地図の番号を選択してください"
                            selection
                            options={mapNumberOptions}
                            className="map-number-dropdown"
                            //共通化したい                onChange={registerPosition}
                            disabled={positionRegistered}
                            clearable
                            //下記2つは何も選択しない際に1つ目のオプションが選択されるのを防止するため
                            forceSelection={false}
                            selectOnBlur={false}
                        />
                    </>
                    :
                    <Container>
                        <UploadImage
                            setImageFile={(imageFile) => setImageFile(imageFile)}
                            setScreenError={(error) => setScreenError(error)}
                        />
                    </Container>
                }
                <img className="map-overview" src="/treasuremapping/overview_g15.png" />
            </motion.div>
        </>
    )
}

export default OfferMapImage