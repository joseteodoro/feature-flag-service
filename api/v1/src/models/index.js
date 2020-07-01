const buildMnemonic = ({user, feature, type = 'LABID'}) => `${feature}:${type}:${user}`

module.exports = { buildMnemonic }
