export const ACCEPT_CONFIG = {
    image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.mpg'],
    video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv', '.mov'],
    document: ['.doc', '.docx', '.xls', '.xlsx', '.csv', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff', '.zip', '.rar', '.wps', '.et', '.ett'],
    getAll(){
        return [...this.image, ...this.video, ...this.document]
    },
};