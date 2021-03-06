import React, { Component } from 'react'
import { Menu as AntMenu, Row, Col, Dropdown, Icon } from 'antd'
import ButtonTransparent from '../../../../common/elements/ButtonTransparent'
import style from './view.less'

const menu = (
  <AntMenu>
    <AntMenu.Item key="0">
      <a href="#">1st AntMenu item</a>
    </AntMenu.Item>
    <AntMenu.Item key="1">
      <a href="#">2nd AntMenu item</a>
    </AntMenu.Item>
    <AntMenu.Divider />
    <AntMenu.Item key="3">
      <a href="#">3d AntMenu item</a>
    </AntMenu.Item>
  </AntMenu>
);

class View extends Component {
  render() {
    return (
      <div className={`border-block-right ${style.container}`}>
        <Col>
          <Row type="flex" justify="space-between" align="middle" className={`container--padding-horizontal ${style.header}`}>
            <h2 className={style.catalogName}>Клиенты</h2>
            <Dropdown
              overlay={menu}
              trigger={['click']}
              placement="bottomRight"
            >
              <ButtonTransparent className="shiftRight"><Icon type="setting-10" /></ButtonTransparent>
            </Dropdown>
          </Row>
        </Col>

        <Col>
          <Row type="flex" className="container--padding-horizontal">
            asdasasd
            asdasasdasas
            asdas
          </Row>
        </Col>
      </div>
    )
  }
}

export default View;
