import { useState, useRef } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function SiteHeader() {

  const [isShown, setIsShown] = useState(false)
  const headerMenuRef = useRef()
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
          <Menu.Item onClick={handleMenuContentClick}>みにくじ</Menu.Item>
          <Menu.Item>Link via prop</Menu.Item>
          <Menu.Item>Javascript Link</Menu.Item>
        </Menu>
      </motion.div>
    )
  }

  const handleToggleMenu = (e) => {
    console.log('menu clicked.')
    setIsShown(!isShown)
    if (!isShown) {
      //Reactの合成イベントに対する親要素へのイベントの伝搬を抑止する
      //menuをクリックした際に親要素のdocumentのリスナーが即時発火してしまうことを抑止
      e.stopPropagation()
      document.addEventListener('click', documentClickHandler)
    }
  }

  const documentClickHandler = (e) => {
    console.log('document clicked.')
    if (headerMenuRef.current.contains(e.target)) {
      return
    }

    setIsShown(false)
    document.removeEventListener('click', documentClickHandler)
  }

  const handleMenuContentClick = () => {
    console.log('menu content clicked.')
    navigate('/minikuji')
    setIsShown(false)
    document.removeEventListener('click', documentClickHandler)
  }

  return (
    <>
      <Menu borderless fixed='top' color='blue' inverted>
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
  )
}

export default SiteHeader
