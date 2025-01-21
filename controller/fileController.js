import prisma from "../model/prismaClient.js";
export const getFile = async (req, res) => {
    const  id  = Number(req.params.fileId)
  
    try {
      const file = await prisma.file.findUnique({
        where: {id}
      });
  
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      res.setHeader('Content-Type', file.fileType);
      res.setHeader('Content-Disposition', `inline; filename="${file.fileName}"`);
      console.log(file.fileName, file.data  )
      res.send(file.data); // Send the binary data
    } catch (error) {
      console.error('Error fetching file:', error);
      res.status(500).json({ error: 'Failed to fetch file' });
    }
  };