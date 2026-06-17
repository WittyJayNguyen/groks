export function composeAuthPayload(form) {
  return {
    email: form.email,
    password: form.password,
    name: form.name,
  };
}
