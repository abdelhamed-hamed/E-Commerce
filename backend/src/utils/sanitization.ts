class Sanitization {
  User(user: any) {
    return {
      _id: user?._id,
      username: user?.username,
      email: user?.email,
      name: user?.name,
      role: user?.role,
      active: user?.active,
      hasPassword: user?.hasPassword,
      image: user?.image,
    };
  }
}

const sanitization = new Sanitization();
export default sanitization;
