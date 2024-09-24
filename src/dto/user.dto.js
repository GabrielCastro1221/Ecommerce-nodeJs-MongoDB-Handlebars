class UserDTO {
  constructor(firstName, lastName, email, role) {
    this.name = firstName;
    this.surName = lastName;
    this.email = email;
    this.rol = role;
  }
}

module.exports = UserDTO;
