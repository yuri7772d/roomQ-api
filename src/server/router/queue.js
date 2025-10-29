router.get("/listing",
    
    async (req, res) => {
  try {
    const result = await userUsecase.listing();

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ mesage: error.message });
  }
});
