import React from 'react'
import { Menu, Icon, Dropdown } from 'semantic-ui-react'

const handleClickSiteName = () => {
  console.log('clicked.')
}

function SiteHeader() {
  return (
    <Menu borderless fixed='top' color='blue' inverted>
      <Menu.Item
        onClick={handleClickSiteName}
      >
        <h4>tof-Tools</h4>
      </Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item>
          <div className="header">
            MENU
            <Icon name='bars' />
          </div>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}

export default SiteHeader
