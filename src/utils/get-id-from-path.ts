const getIdFromPath = (path: string | null) => {
  const id = path?.split('/')[3];

  return id;
};

export default getIdFromPath;
