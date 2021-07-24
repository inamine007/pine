const validRules = {
  isSelected: v => !!v || '選択してください',
  isNotEmpty: v => !!v || '必ず入力してください',
  isChecked: v => v === [] || '1つは必ず選択してください',
}

const validMessages = {
  isTypeMiss: '入力に誤りがあります',
  isUniqueMail: '入力したメールアドレスはすでに使用されています',
}

export default {
  data() {
    return {
      validRules: validRules,
      validMessages: validMessages,
    }
  }
}