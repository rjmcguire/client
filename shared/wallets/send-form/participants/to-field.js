// @flow
import * as React from 'react'
import * as Kb from '../../../common-adapters'
import * as Styles from '../../../styles'
import {ParticipantsRow} from '../../common'
import {SelectedEntry, DropdownEntry, DropdownText} from './dropdown'
import Search from './search'
import type {Account} from '.'
import type {CounterpartyType} from '../../../constants/types/wallets'

type ToFieldProps = {|
  recipientType: CounterpartyType,
  // Used for send to stellar address
  incorrect?: string,
  onChangeAddress?: string => void,
  // Used for sending from account to account
  accounts: Account[],
  onChangeSelectedAccount: (accountName: string) => void,
  onLinkAccount?: () => void,
  onCreateNewAccount?: () => void,
  // Used to display a keybase profile
  username?: string,
  fullName?: string,
  onShowProfile?: string => void,
  onRemoveProfile?: () => void,
|}

type ToFieldState = {|
  selectedAccount: ?Account,
  selectedUser: ?string,
|}

class ToField extends React.Component<ToFieldProps, ToFieldState> {
  state = {
    selectedAccount: null,
    selectedUser: null,
  }

  onRemoveUser = () => {
    this.setState({selectedUser: null})
  }

  onDropdownChange = (node: React.Node) => {
    if (React.isValidElement(node)) {
      // $FlowIssue React.isValidElement refinement doesn't happen, see https://github.com/facebook/flow/issues/6392
      const element = (node: React.Element<any>)
      if (element.type === DropdownText) {
        if (element.key === 'create-new' && this.props.onCreateNewAccount) {
          this.props.onCreateNewAccount()
        } else if (element.key === 'link-existing' && this.props.onLinkAccount) {
          this.props.onLinkAccount()
        }
      } else if (this.props.onChangeSelectedAccount) {
        this.setState({selectedAccount: element.props.account})
        this.props.onChangeSelectedAccount(element.props.account.name)
      }
    }
  }

  render() {
    let component

    if (this.state.selectedUser) {
      component = (
        <React.Fragment>
          <Kb.NameWithIcon
            colorFollowing={true}
            horizontal={true}
            username={this.state.selectedUser}
            // metaOne={'test'}
            onClick={this.props.onShowProfile}
            avatarStyle={styles.avatar}
          />
          <Kb.Icon
            type="iconfont-remove"
            boxStyle={Kb.iconCastPlatformStyles(styles.keybaseUserRemoveButton)}
            fontSize={16}
            color={Styles.globalColors.black_20}
            onClick={this.onRemoveUser}
          />
        </React.Fragment>
      )
    } else if (this.props.recipientType === 'otherAccount') {
      if (this.props.accounts.length <= 1 && this.props.onCreateNewAccount) {
        component = (
          <Kb.Box2 direction="horizontal" centerChildren={true} style={{width: 270}}>
            <Kb.Button
              type="Wallet"
              style={styles.createNewAccountButton}
              label="Create a new account"
              onClick={this.props.onCreateNewAccount}
            />
          </Kb.Box2>
        )
      } else {
        let items = [
          <DropdownText key="link-existing" text="Link an existing Stellar account" />,
          <DropdownText key="create-new" text="Create a new account" />,
        ]

        if (this.props.accounts.length > 0) {
          const walletItems = this.props.accounts.map((account, index) => (
            <DropdownEntry key={index} account={account} />
          ))
          items = walletItems.concat(items)
        }

        component = (
          <Kb.Dropdown
            onChanged={this.onDropdownChange}
            items={items}
            selected={
              this.state.selectedAccount ? <SelectedEntry account={this.state.selectedAccount} /> : undefined
            }
          />
        )
      }
    } else if (this.props.recipientType === 'stellarPublicKey') {
      component = (
        <Kb.Box2 direction="vertical" fullWidth={true} style={styles.inputBox}>
          <Kb.Box2 direction="horizontal" fullWidth={true} style={styles.inputInner}>
            <Kb.Icon
              type={this.props.incorrect ? 'icon-stellar-logo-grey-16' : 'icon-stellar-logo-16'}
              style={Kb.iconCastPlatformStyles(styles.stellarIcon)}
            />
            <Kb.NewInput
              type="text"
              onChangeText={this.props.onChangeAddress}
              textType="BodySemibold"
              placeholder={'Stellar address'}
              placeholderColor={Styles.globalColors.black_20}
              hideBorder={true}
              containerStyle={styles.input}
              multiline={true}
              rowsMin={2}
              rowsMax={3}
            />
          </Kb.Box2>
          {!!this.props.incorrect && (
            <Kb.Text type="BodySmall" style={styles.errorText}>
              {this.props.incorrect}
            </Kb.Text>
          )}
        </Kb.Box2>
      )
    } else {
      return (
        <Search
          onClickResult={(id: string) => this.setState({selectedUser: id})}
          onClose={() => console.log('search', 'onClose')}
          onShowTracker={() => console.log('search', 'onShowTracker')}
        />
      )
    }

    return (
      <ParticipantsRow
        heading="To"
        headingAlignment={this.props.recipientType === 'otherAccount' ? 'Right' : 'Left'}
        headingStyle={
          this.props.recipientType === 'stellarPublicKey' && !this.props.username
            ? {alignSelf: 'flex-start'}
            : {}
        }
        dividerColor={this.props.incorrect ? Styles.globalColors.red : ''}
        bottomDivider={!!this.props.incorrect && this.props.recipientType === 'stellarPublicKey'}
      >
        {component}
      </ParticipantsRow>
    )
  }
}

const styles = Styles.styleSheetCreate({
  avatar: {
    marginRight: 8,
  },
  createNewAccountButton: Styles.platformStyles({
    isElectron: {
      width: 194,
    },
  }),
  errorText: Styles.platformStyles({
    common: {
      color: Styles.globalColors.red,
      width: '100%',
    },
    isElectron: {
      wordWrap: 'break-word',
    },
  }),
  input: {
    padding: 0,
  },
  inputBox: {flexGrow: 1},
  inputInner: {
    alignItems: 'flex-start',
  },
  keybaseUserRemoveButton: {
    flex: 1,
    textAlign: 'right',
  },
  stellarIcon: {
    alignSelf: 'flex-start',
    marginRight: Styles.globalMargins.xxtiny,
  },
})

export default ToField
