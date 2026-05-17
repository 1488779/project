function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Файл не загружен' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    res.status(500).json({ success: false, error: 'Ошибка загрузки файла' });
  }
}

module.exports = { uploadFile };