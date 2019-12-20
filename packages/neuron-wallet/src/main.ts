import { app } from 'electron'

import WalletService from 'services/wallets'
import NodeController from 'controllers/node'
import AppController from 'controllers/app'
import { changeLanguage } from 'utils/i18n'
import env from 'env'
import { register as registerListeners } from 'listeners/main'

let appController = new AppController()

app.on('ready', async () => {
  changeLanguage(app.getLocale())

  if (!env.isTestMode) {
    await NodeController.startNode()
  }

  registerListeners()

  WalletService.getInstance().generateAddressesIfNecessary()

  appController.start()
})

app.on('before-quit', async () => {
  if (!env.isTestMode) {
    NodeController.stopNode()
  }
})

app.on('activate', appController.openWindow)
