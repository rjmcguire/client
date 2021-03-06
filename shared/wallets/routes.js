// @flow
import * as Constants from '../constants/wallets'
import {makeRouteDefNode, makeLeafTags} from '../route-tree'
import {isMobile} from '../constants/platform'
import CreateNewAccount from './create-account/container'
import LinkExisting from './link-existing/container'
import Container from './container'
import ReceiveModal from './receive-modal/container'
import ExportSecretKey from './export-secret-key/container'
import TransactionDetails from './transaction-details/container'
import SendForm from './send-form/container'
import ConfirmForm from './confirm-form/container'

const createNewAccount = {
  children: {},
  component: CreateNewAccount,
  tags: makeLeafTags({layerOnTop: !isMobile}),
}

const linkExisting = {
  children: {},
  component: LinkExisting,
  tags: makeLeafTags({layerOnTop: !isMobile}),
}

const routeTree = makeRouteDefNode({
  children: {
    createNewAccount,
    exportSecretKey: {
      children: {},
      component: ExportSecretKey,
      tags: makeLeafTags({layerOnTop: !isMobile}),
    },
    linkExisting,
    receive: {
      children: {},
      component: ReceiveModal,
      tags: makeLeafTags({layerOnTop: !isMobile}),
    },
    [Constants.sendReceiveFormRouteKey]: {
      children: {
        [Constants.confirmFormRouteKey]: {
          children: {},
          component: ConfirmForm,
          tags: makeLeafTags({layerOnTop: !isMobile}),
        },
        linkExisting,
        createNewAccount,
      },
      component: SendForm,
      tags: makeLeafTags({layerOnTop: !isMobile}),
    },
    transactionDetails: {
      component: TransactionDetails,
    },
  },
  component: Container,
  defaultSelected: '',
  tags: makeLeafTags({}),
})

export default routeTree
