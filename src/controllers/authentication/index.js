const { compare } = require('bcrypt')
const jwt = require('jsonwebtoken')
const { applySpec, path } = require('ramda')

const database = require('../../../database')
const { Api404Error, Api401Error } = require('../../utils/Errors')

const UserModel = database.model('user')
const CompanyModel = database.model('company')

const secret = process.env.SECRET

const buildPayloadToken = applySpec({
  id: path(['id']),
  name: path(['name']),
  document: path(['document']),
  password: path(['password']),
  userType: path(['userType']),
  activated: path(['activated']),
  createdAt: path(['createdAt']),
  updatedAt: path(['updatedAt']),
  companyId: path(['companyId']),
  companyGroupId: path(['company', 'companyGroupId'])
})

const authentication = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      where: { document: req.body.document },
      include: CompanyModel
    })

    if (!user) throw new Api404Error('User not found')

    const payloadToken = buildPayloadToken(user)

    const checkedPassword = await compare(req.body.password, user.password)

    if (!checkedPassword) throw new Api401Error('Invalid password')

    const token = jwt.sign({ user: payloadToken }, secret, { expiresIn: '96h' })
    res.json({ user, token })
  } catch (error) {
    next(error)
  }
}

const checkToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers.authorization

  if (token) {
    jwt.verify(token.slice(7, token.length), secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token is not valid'
        })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.status(403).json({
      success: false,
      message: 'Auth token is not supplied'
    })
  }
}

module.exports = {
  authentication,
  checkToken
}
