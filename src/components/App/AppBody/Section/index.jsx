import React, { Component } from 'react'
// import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import apiActions from '../../../../actions/apiActions'
// import NavRoute from '../../../common/router/Route'
// import routes from '../../../../routes'
// import Header from './Header'

import PRIVILEGE_CODES from '../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../utils/rights'

import CatalogsMenu from './CatalogsMenu'
import SectionHeader from './SectionHeader'
import SectionBody from './SectionBody'

import styles from './section.less'

class Section extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired
  }
  componentDidMount() {
    const sectionId = this.props.sectionId;
    if (sectionId) {
      apiActions.getSection({ sectionId });
      // apiActions.getCatalogs({ sectionId });
    }
  }
  componentWillReceiveProps(nextProps) {
    const newSectionId = nextProps.sectionId;

    if (newSectionId && this.props.sectionId !== newSectionId) {
      // update catalogs.
      apiActions.getSection({ sectionId: newSectionId });
      // apiActions.getCatalogs({ sectionId: newSectionId });
    }
  }
  render() {
    const sectionId = this.props.sectionId;
    const catalogs = this.props.appState.get('catalogs');

    const section = this.props.appState.getIn(['sections', sectionId]);
    // todo: check access for
    const isAccessAdmin = checkAccessOnObject(RESOURCE_TYPES.SECTION, section, PRIVILEGE_CODES.ADMIN);

    return (
      <div>
        <Row type="flex" justify="space-between" align="middle" className={styles.header}>
          <CatalogsMenu
            sectionId={sectionId}
            catalogs={catalogs}
            isAccessAdmin={isAccessAdmin}
          />
          <Col>
            <SectionHeader
              section={section}
              isAccessAdmin={isAccessAdmin}
            />
          </Col>
        </Row>
        <SectionBody { ...this.props } />
      </div>
    )
  }
}

export default Section;