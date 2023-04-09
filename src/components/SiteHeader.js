import { useState, useRef } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function SiteHeader() {

  const [isShown, setIsShown] = useState(false);
  const headerMenuRef = useRef();
  const navigate = useNavigate();

  const handleClickSiteName = () => {
    navigate('/');
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
          <Menu.Item onClick={() => handleMenuContentClick('/minikuji')}>みにくじ</Menu.Item>
          <Menu.Item onClick={() => handleMenuContentClick('/treasuremapping')}>宝の地図画像判定</Menu.Item>
        </Menu>
      </motion.div>
    )
  }

  //useRef()を使用して、書き換え可能な値としてdocumentClickHandlerを定義する
  const documentClickHandler = useRef((e) => {
    if (headerMenuRef.current.contains(e.target)) {
      return;
    }
    setIsShown(false);
    document.removeEventListener('click', documentClickHandler.current);
  });

  const handleToggleMenu = (e) => {
    setIsShown(!isShown);
    if (!isShown) {
      //Reactの合成イベントに対する親要素へのイベントの伝搬を抑止する
      //menuをクリックした際に親要素のdocumentのリスナーが即時発火してしまうことを抑止
      e.stopPropagation();
      //document要素=画面全範囲をクリックした際の処理を設定
      document.addEventListener('click', documentClickHandler.current);
    }
  }

  const handleMenuContentClick = (linkToPath) => {
    navigate(linkToPath);
    setIsShown(false);
    document.removeEventListener('click', documentClickHandler.current);
  }

  return (
    <>
        <Menu borderless>
          <Menu.Item
            onClick={handleClickSiteName}
          >
            <h4>tof-Tools</h4>
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
        ref={headerMenuRef}
      >
        <AnimatePresence>
          {isShown ? <HeaderMenu /> : null}
        </AnimatePresence>
      </div>
    </>
  );
}

export default SiteHeader
