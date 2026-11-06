/**
 * The Cookpad + button, which stays still while the recipe page scrolls under it. Hovering it
 * (or focusing or tapping it) shows the Add Recipe balloon, as in the design. Only the + catches
 * the pointer, so the rest of the page still scrolls and clicks as usual.
 */
export function FixedAddButton() {
  return (
    <div className="fixed-add">
      <img className="fixed-add__plus" src="/images/projects/cookpad-add-plus.webp" alt="Add Recipe button" width={122} height={120} tabIndex={0} />
      <img className="fixed-add__balloon" src="/images/projects/cookpad-add-balloon.webp" alt="" width={210} height={100} />
    </div>
  )
}
