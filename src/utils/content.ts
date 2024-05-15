import { ContentType, ContentTypeCategory } from "./types";

const EXCEL_CONTENT_TYPES = [
	"application/excel",
	"application/vnd.ms-excel",
	"application/x-excel",
	"application/x-msexcel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];

// https://www.sitepoint.com/mime-types-complete-list/
export const CONTENT_TYPE = {
// image
	png: <ContentType>{
		name: "PNG image",
		allowedContentTypes: ["image/png"],
		allowedExtensions: ["png"],
		categories: [ContentTypeCategory.image]
	},
	jpg: <ContentType>{
		name: "JPEG image (jpg, jpeg)",
		allowedContentTypes: ["image/jpg", "image/jpeg"],
		allowedExtensions: ["jpg", "jpeg"],
		categories: [ContentTypeCategory.image]
	},
	gif: <ContentType>{
		name: "GIF image",
		allowedContentTypes: ["image/gif"],
		allowedExtensions: ["gif"],
		categories: [ContentTypeCategory.image]
	},

	// document
	xls: <ContentType>{
		name: "Excel workbook (xls, xlsx)",
		allowedContentTypes: EXCEL_CONTENT_TYPES,
		allowedExtensions: ["xls", "xlsx"],
		categories: [ContentTypeCategory.document, ContentTypeCategory.spreadsheet]
	},
	doc: <ContentType>{
		name: "Word document (doc, docx)",
		allowedContentTypes: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
		allowedExtensions: ["doc", "docx"],
		categories: [ContentTypeCategory.document]
	},
	eps: <ContentType>{
		name: "Postscript document (eps)",
		allowedContentTypes: ["application/postscript"],
		allowedExtensions: ["eps", "ai"],
		categories: [ContentTypeCategory.document]
	},
	pdf: <ContentType>{
		name: "PDF document",
		allowedContentTypes: ["application/pdf"],
		allowedExtensions: ["pdf"],
		categories: [ContentTypeCategory.document]
	},

	// text
	csv: <ContentType>{
		name: "CSV file",
		allowedContentTypes: ["text/csv"],
		allowedExtensions: ["csv"],
		categories: [ContentTypeCategory.text, ContentTypeCategory.spreadsheet]
	},
	txt: <ContentType>{
		name: "Text file (txt)",
		allowedContentTypes: ["text/plain"],
		allowedExtensions: ["txt"],
		categories: [ContentTypeCategory.text]
	}
};

export const CONTENT_TYPES = {
	all: Object.values(CONTENT_TYPE),
	images: Object.values(CONTENT_TYPE).filter(t => t.categories.includes(ContentTypeCategory.image)),
	documents: Object.values(CONTENT_TYPE).filter(t => t.categories.includes(ContentTypeCategory.document)),
	texts: Object.values(CONTENT_TYPE).filter(t => t.categories.includes(ContentTypeCategory.text)),
	spreadsheets: Object.values(CONTENT_TYPE).filter(t => t.categories.includes(ContentTypeCategory.spreadsheet))
};
