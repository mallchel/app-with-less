import React, { Component } from 'react'
import HeaderCatalog from './HeaderCatalog'
import Body from './body/Body'
import styles from './content.less'

class Content extends Component {
  render() {
    return (
      <div className={styles.container}>
        <HeaderCatalog { ...this.props } />
        <Body { ...this.props } />
      </div>
    )
  }
}

export default Content;
