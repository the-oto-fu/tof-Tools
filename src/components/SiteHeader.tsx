import { useState, useCallback } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Constants } from '../config/constants'

function SiteHeader() {

  const [isShown, setIsShown] = useState(false);
  const navigate = useNavigate();

  const handleClickSiteName = () => {
    navigate(Constants.ScreenPath.TOP);
  }

  function HeaderMenu() {
    return (
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Menu vertical>
          <Menu.Item onClick={() => handleMenuContentClick(Constants.ScreenPath.MINIKUJI)}>みにくじ</Menu.Item>
          <Menu.Item onClick={() => handleMenuContentClick(Constants.ScreenPath.TREAUSURE_MAPPING)}>宝の地図画像判定</Menu.Item>
        </Menu>
      </motion.div>
    )
  }

  //useCallbackを使用して関数をメモ化する。メモ化しないとレンダリングの度に関数が作成される。
  //Reactでは関数をイベントハンドラとして使う場合はメモ化していないと別関数扱いとなり、
  //removeEventListenerで削除できず残り続けてしまう。
  const documentClickHandler = useCallback(() => {
    setIsShown(false);
    document.removeEventListener('click', documentClickHandler);
  }, []);

  const handleToggleMenu = (e: React.SyntheticEvent<HTMLElement>) => {
    setIsShown(!isShown);
    if (!isShown) {
      //Reactの合成イベントに対する親要素へのイベントの伝搬を抑止する
      //menuをクリックした際に親要素のdocumentのリスナーが即時発火してしまうことを抑止
      e.stopPropagation();
      //document要素=画面全範囲をクリックした際の処理を設定
      document.addEventListener('click', documentClickHandler);
    }
  }

  const handleMenuContentClick = (linkToPath: string) => {
    setIsShown(false);
    document.removeEventListener('click', documentClickHandler);
    navigate(linkToPath);
  }

  return (
    <>
      <Menu borderless>
        <Menu.Item
          onClick={handleClickSiteName}
        >
          <h4>tofTool</h4>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item onClick={handleToggleMenu}>
            <div className="header-menubar">
              MENU
              <Icon name='bars' />
            </div>
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <div
        className='header-menu'
      >
        <AnimatePresence>
          {isShown ? HeaderMenu() : null}
        </AnimatePresence>
      </div>
    </>
  );
}

export default SiteHeader
