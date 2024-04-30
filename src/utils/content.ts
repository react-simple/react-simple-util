export enum ContentTypeCategory {
	image = "image",
	document = "document"
}

export interface ContentType {
	allowedContentTypes: string[];
	allowedExtensions: string[];
	category: ContentTypeCategory;
}

const EXCEL_CONTENT_TYPES = [
	"application/excel",
	"application/vnd.ms-excel",
	"application/x-excel",
	"application/x-msexcel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];

// https://www.sitepoint.com/mime-types-complete-list/
// xls,xlsx,csv,pdf,docx,doc,jpg,jpeg,png,gif,ics,eps,ai
// ics is not yet added (iCalendar)
export const CONTENT_TYPE = {
// image
	png: <ContentType>{
		allowedContentTypes: ["image/png"],
		allowedExtensions: ["png"],
		category: ContentTypeCategory.image
	},
	jpg: <ContentType>{
		allowedContentTypes: ["image/jpg", "image/jpeg"],
		allowedExtensions: ["jpg", "jpeg"],
		category: ContentTypeCategory.image
	},
	gif: <ContentType>{
		allowedContentTypes: ["image/gif"],
		allowedExtensions: ["gif"],
		category: ContentTypeCategory.image
	},

	// document
	xls: <ContentType>{
		allowedContentTypes: EXCEL_CONTENT_TYPES,
		allowedExtensions: ["xls", "xlsx"],
		category: ContentTypeCategory.document
	},
	csv: <ContentType>{
		allowedContentTypes: EXCEL_CONTENT_TYPES,
		allowedExtensions: ["csv"],
		category: ContentTypeCategory.document
	},
	doc: <ContentType>{
		allowedContentTypes: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
		allowedExtensions: ["doc", "docx"],
		category: ContentTypeCategory.document
	},
	eps: <ContentType>{
		allowedContentTypes: ["application/postscript"],
		allowedExtensions: ["eps", "ai"],
		category: ContentTypeCategory.document
	},
	pdf: <ContentType>{
		allowedContentTypes: ["application/pdf"],
		allowedExtensions: ["pdf"],
		category: ContentTypeCategory.document
	},
};

export const CONTENT_TYPES = {
	all: Object.values(CONTENT_TYPE),
	images: Object.values(CONTENT_TYPE).filter(t => t.category === ContentTypeCategory.image),
	documents: Object.values(CONTENT_TYPE).filter(t => t.category === ContentTypeCategory.document),
};
