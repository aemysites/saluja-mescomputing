/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable no-undef */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const rimraf = require('rimraf');

function mergeAndCleanupFolders(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    console.log(`Directory does not exist: ${directoryPath}`);
    return; // Skip non-existent directories
  }

  console.log(`Processing directory: ${directoryPath}`);
  const directoryItems = fs.readdirSync(directoryPath);
  console.log(`Contents of ${directoryPath}:`, directoryItems);

  // Filter the list to find directories that contain numbered DOCX files
  const foldersWithNumberedDOCX = directoryItems.filter((item) => {
    const folderPath = path.join(directoryPath, item);

    // Check if the item is a directory
    if (fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()) {
      // Check if the directory contains numbered DOCX files
      const docxFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.docx'));
      console.log(`DOCX files in ${folderPath}:`, docxFiles);
      return docxFiles.some((file) => /^(\d+)\.docx$/.test(file));
    }

    return false;
  });

  // Log the folder directories
  console.log('Folders with numbered DOCX files:', foldersWithNumberedDOCX);

  foldersWithNumberedDOCX.forEach((folderName) => {
    const folderPath = path.join(directoryPath, folderName);

    // Find numbered DOCX files in the folder
    const numberedDocxFiles = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith('.docx') && /^(\d+)\.docx$/.test(file))
      .sort((a, b) => {
        const aNumber = parseInt(a.match(/^(\d+)\.docx$/)[1]);
        const bNumber = parseInt(b.match(/^(\d+)\.docx$/)[1]);
        return aNumber - bNumber;
      });

    // Log the DOCX files within the folder
    console.log(`DOCX files in folder ${folderPath}:`, numberedDocxFiles);

    if (numberedDocxFiles.length === 0) {
      console.log(`No numbered DOCX files found in ${folderPath}.`);
    } else {
      // Build the Pandoc command to merge all the DOCX files
      const mergedFileName = path.join(folderPath, 'merged.docx');
      const mergeCommand = `pandoc ${numberedDocxFiles
        .map((file) => `"${path.join(folderPath, file)}"`)
        .join(' ')} -o "${mergedFileName}"`;

      try {
        // Execute the Pandoc command to merge the files
        console.log(`Executing merge command: ${mergeCommand}`);
        execSync(mergeCommand);
        console.log(`Merged ${numberedDocxFiles.length} DOCX files into ${mergedFileName}.`);

        // Delete individual numbered DOCX files after successful merge
        numberedDocxFiles.forEach((file) => {
          const filePath = path.join(folderPath, file);
          fs.unlinkSync(filePath);
        });
        console.log(`Deleted individual numbered DOCX files in ${folderPath}.`);

        // Check for the parent document in the parent directory
        const parentDirectory = path.dirname(directoryPath); // One level up
        const parentFolderName = path.basename(directoryPath); // Name of the parent folder
        const parentFileName = `${parentFolderName}.docx`;
        const parentFileNameWithHyphen = `${parentFolderName}-.docx`;
        const parentFilePath = path.join(parentDirectory, parentFileName);
        const parentFilePathWithHyphen = path.join(parentDirectory, parentFileNameWithHyphen);

        console.log(`Looking for parent files in: ${parentDirectory}`);
        console.log(`Parent file path: ${parentFilePath}`);
        console.log(`Parent file path with hyphen: ${parentFilePathWithHyphen}`);

        // Log if the parent files exist
        let appended = false;
        if (fs.existsSync(parentFilePath)) {
          // Append the content from merged.docx to the parent file
          const tempFilePath = path.join(directoryPath, 'temp.docx');
          const appendCommand = `pandoc "${parentFilePath}" "${mergedFileName}" -o "${tempFilePath}"`;
          console.log(`Executing append command: ${appendCommand}`);
          execSync(appendCommand);
          fs.renameSync(tempFilePath, parentFilePath); // Rename the temp file to the parent file
          console.log(`Appended content from ${mergedFileName} to ${parentFileName}.`);
          appended = true;
        } else if (fs.existsSync(parentFilePathWithHyphen)) {
          // Append the content from merged.docx to the parent file with a hyphen
          const tempFilePath = path.join(directoryPath, 'temp.docx');
          const appendCommand = `pandoc "${parentFilePathWithHyphen}" "${mergedFileName}" -o "${tempFilePath}"`;
          console.log(`Executing append command: ${appendCommand}`);
          execSync(appendCommand);
          fs.renameSync(tempFilePath, parentFilePathWithHyphen); // Rename the temp file to the parent file with a hyphen
          console.log(`Appended content from ${mergedFileName} to ${parentFileNameWithHyphen}.`);
          appended = true;
        }

        if (appended) {
          // Delete the folder where merged.docx is found
          rimraf.sync(folderPath);
          console.log(`Deleted folder ${folderPath}.`);
        }
      } catch (error) {
        console.error(`Error merging DOCX files for folder ${folderPath}:`, error.message);
      }
    }
  });

  // Recursively process subdirectories
  directoryItems.forEach((item) => {
    const itemPath = path.join(directoryPath, item);
    if (fs.existsSync(itemPath) && fs.lstatSync(itemPath).isDirectory()) {
      mergeAndCleanupFolders(itemPath);
    }
  });
}

// Start the process from the current working directory
mergeAndCleanupFolders(process.cwd());
