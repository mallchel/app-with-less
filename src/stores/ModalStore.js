import Reflux from 'reflux';
import debug from 'debug';
import ViewInputModal from '../components/views/ViewInputModal';
import modalsActions from '../actions/modalsActions';
import filterActions from '../actions/filterActions';
import viewsActions from '../actions/viewActions';
import recordActions from '../actions/recordActions';
import apiActions from '../actions/apiActions';
import trs from '../getTranslations';
import guid from 'guid';
import appState from '../appState'
import RESOURCE_TYPES from '../configs/resourceTypes';
import { base } from '../components/common/Modal'
import {MODAL_ONLY} from '../configs/appModes';

function _openRecordModal(component, catalogId, recordId, recordName, {allowClose, onCreate}) {
  let mode = appState.getIn(['mode']);
  let isFullScreen = appState.getIn(['modalsFullScreen']);

  base({
    component: component,
    recordId,
    recordName,
    catalogId,
    allowClose,
    onSave: onCreate
  }, {
    css: 'record-modal ' + (isFullScreen && 'record-modal--full-screen')
  }, mode === MODAL_ONLY);
}

const ModalStore = Reflux.createStore({
  listenables: [modalsActions],

  openAccessModal({object, parents}, resource, accessProps, hasAdminRule = false, onCloseCb) {
    let RightsModal = require('../components/access/AccessModal');
    const {readOnly, isAdmin} = accessProps;
    base({
      component: RightsModal,
      object,
      parents,
      resource,
      readOnly,
      isAdmin,
      hasAdminRule
    }, {
      css: 'access-modal'
    }, false, onCloseCb, onCloseCb);
  },

  openViewFieldRightsModal(
    rule,
    index,
    object,
    basePrivilege,
    onSaveCb,
    onCloseCb
  ) {
    let FieldRightsModal = require('../components/access/FieldRightsModal');
    base({
      component: FieldRightsModal,
      rule,
      index,
      object,
      basePrivilege
    }, {
      css: 'access-modal'
    }, false, onSaveCb, onCloseCb);
  },

  openViewAccessModal(viewId, readOnly, onCloseCb) {
    let object = {viewId};
    let parents = [{
      sectionId: appState.getIn(['currentCatalog', 'sectionId'])
    }, {
      catalogId: appState.getIn(['currentCatalog', 'id'])
    }];

    this.openAccessModal({object, parents}, RESOURCE_TYPES.VIEW, { readOnly }, false, onCloseCb);
  },

  openRecordModal(catalogId, recordId, recordName, allowClose = true) {
    let RecordModal = require('../components/record/RecordModal');
    let mode = appState.getIn(['mode']);

    recordActions.openLinkedRecordModal(catalogId, recordId);

    _openRecordModal(RecordModal, catalogId, recordId, recordName, {allowClose})
  },

  /**
   * Open modal create related record
   * @param catalogId
   * @param linkedRecord {Object<catalog, record>} record to link with
   * @param options {Object}
   */
  openRelatedRecordCreate(catalogId, linkedRecord, options = {}) {
    let {allowClose = true, onCreate} = options;
    let newRecordId = guid.raw();
    let RecordModalCreate = require('../components/record/RecordModalCreate');

    recordActions.generateNewRecord(catalogId, newRecordId, linkedRecord);

    _openRecordModal(RecordModalCreate, catalogId, newRecordId, '', {allowClose, onCreate})
  },

  openLinkedRecordCreate(catalogId, options = {}) {
    let {allowClose = true, onCreate} = options;
    let newRecordId = guid.raw();
    let RecordModalCreate = require('../components/record/RecordModalCreate');

    // если надо открыть уже существующую новую строку, то тут надо найти ее в appState и передать в попап и не вызывать экшны
    recordActions.generateNewRecord(catalogId, newRecordId);
    //apiActions.getFields(catalogId);

    _openRecordModal(RecordModalCreate, catalogId, newRecordId, '', {allowClose, onCreate})
  },

  openViewInputModal(catalogId, accessOnViewForRights) {
    base({
      component: ViewInputModal,
      isNew: true,
      headerText: trs('modals.createNewView.headerText'),
      onSave: (params) => viewsActions.createNewView(catalogId, params),
      disabledChangeType: !accessOnViewForRights
    });
  },

  openViewInputModalEdit(currView, catalogId) {
    base({
      component: ViewInputModal,
      isNew: false,
      headerText: trs('modals.editNewView.headerText'),
      name: currView.get('name'),
      originName: currView.get('originName'),
      rights: currView.get('forRights'),
      onSave: (params) => {
        apiActions.updateView({
          catalogId,
          viewId: currView.get('id'),
          forRights: currView.get('forRights')
        }, params);
      }
    });
  }
});


export default ModalStore;