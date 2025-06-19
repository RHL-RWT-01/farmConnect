export const scrollToSection = (e: React.MouseEvent, id: string) => {
  e.preventDefault()
  const path = "/"
  if (window.location.pathname !== path) {
    window.location.href = `/${id}`
  } else {
    const section = document.getElementById(id.replace("#", ""))
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }
}
