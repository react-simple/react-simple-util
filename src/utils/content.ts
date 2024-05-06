export enum ContentTypeCategory {
	image = "image",
	document = "document",
	text = "text",
	spreadsheet = "spreadsheet"
}

export interface ContentType {
	allowedContentTypes: string[];
	allowedExtensions: string[];
	categories: ContentTypeCategory[];
}

const EXCEL_CONTENT_TYPES = [
	"application/excel",
	"application/vnd.ms-excel",
	"application/x-excel",
	"application/x-msexcel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"text/csv"
];

// https://www.sitepoint.com/mime-types-complete-list/
export const CONTENT_TYPE = {
// image
	png: <ContentType>{
		allowedContentTypes: ["image/png"],
		allowedExtensions: ["png"],
		categories: [ContentTypeCategory.image]
	},
	jpg: <ContentType>{
		allowedContentTypes: ["image/jpg", "image/jpeg"],
		allowedExtensions: ["jpg", "jpeg"],
		categories: [ContentTypeCategory.image]
	},
	gif: <ContentType>{
		allowedContentTypes: ["image/gif"],
		allowedExtensions: ["gif"],
		categories: [ContentTypeCategory.image]
	},

	// document
	xls: <ContentType>{
		allowedContentTypes: EXCEL_CONTENT_TYPES,
		allowedExtensions: ["xls", "xlsx"],
		categories: [ContentTypeCategory.document, ContentTypeCategory.spreadsheet]
	},
	doc: <ContentType>{
		allowedContentTypes: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
		allowedExtensions: ["doc", "docx"],
		categories: [ContentTypeCategory.document]
	},
	eps: <ContentType>{
		allowedContentTypes: ["application/postscript"],
		allowedExtensions: ["eps", "ai"],
		categories: [ContentTypeCategory.document]
	},
	pdf: <ContentType>{
		allowedContentTypes: ["application/pdf"],
		allowedExtensions: ["pdf"],
		categories: [ContentTypeCategory.document]
	},

	// text
	csv: <ContentType>{
		allowedContentTypes: EXCEL_CONTENT_TYPES,
		allowedExtensions: ["csv"],
		categories: [ContentTypeCategory.text, ContentTypeCategory.spreadsheet]
	},
	txt: <ContentType>{
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
