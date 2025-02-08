import {CustomDocumentPicker} from './documentPicker.package';
interface imagePickerInterface {
  success: (params: any) => void;
  failed?: (params: any) => void;
  multiple?: boolean;
  mediaType?: string | string[] | undefined;
}

class documentPicker {
  async select({success, failed, mediaType, multiple}: imagePickerInterface) {
    try {
      const image = await CustomDocumentPicker.pick({
        type: mediaType || [CustomDocumentPicker.types.allFiles],
        allowMultiSelection: multiple || false,
      });
      success(image);
    } catch (e) {
      failed && failed(false);
    }
  }
}

export default new documentPicker();
