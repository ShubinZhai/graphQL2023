module.exports = {
  extends: ['@commitlint/config-conventional'],
  "rules": {
    "header-max-length": [0, "always", 72],
    "body-empty":[1, "never",0],
    "subject-empty":[0, "never",0],
    "type-empty":[0, "never",0]

  }

}
