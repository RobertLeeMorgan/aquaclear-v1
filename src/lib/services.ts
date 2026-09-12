export const sortServices = (services: any) => {
  const order = [
    "weed-cutting",
    "blanket-weed-removal",
    "bulrush-removal",
    "invasive-species-removal",
    "water-lily-management",
    "reed-bed-management",
    "silt-pumping",
    "trash-and-debris-removal",
    "excavation-and-ditching",
    "tree-work",
  ];

  return [...services].sort(
    (a, b) => order.indexOf(a.id) - order.indexOf(b.id),
  );
};
