const label = {
  group: "グループ",
  friend: "お友達",
}

const icon = {
  group: require("../assets/images/i_users.svg"),
  friend: require("../assets/images/i_user.svg"),
}

export default {
  data() {
    return {
      C_LABEL: label,
      C_ICON: icon,
    }
  }
}