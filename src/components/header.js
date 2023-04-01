import { useState, useRef } from 'react'
import { Menu, Icon } from 'semantic-ui-react'

//https://qiita.com/G4RDSjp/items/58364a6655d4968a90d9

const handleClickSiteName = () => {
  console.log('clicked.')
}

function HeaderMenu() {
  return (
    <Menu vertical>
      <Menu.Item href='//example.com' target='_blank'>
        Visit another website
      </Menu.Item>
      <Menu.Item>Link via prop</Menu.Item>
      <Menu.Item>Javascript Link</Menu.Item>
    </Menu>
  )
}

function SiteHeader() {

  const [isShown, setIsShown] = useState(false)

  const handelToggleMenu = () => {
    setIsShown(!isShown)
    document.addEventListener('click', documentClickHander)  
  }

  const documentClickHander = e => {
//    if(headerMenuRef.current.containts(e.target)){
//      return
//    }

    setIsShown(false)
    document.removeEventListener('click', documentClickHander)
  }

  const headerMenuRef = useRef()

  return (
    <>
      <Menu borderless fixed='top' color='blue' inverted>
        <Menu.Item
          onClick={handleClickSiteName}
        >
          <h4>tof-Tools</h4>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item onClick={handelToggleMenu}>
            <div className="header-menubar">
              MENU
              <Icon name='bars' />
            </div>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <div className={`headerMenu ${isShown ? 'shown' : ''}`}
        ref={headerMenuRef}
      >
        <HeaderMenu />
      </div>
    </>
  )
}

export default SiteHeader
