interface ArticleSchemaProps {
	headline: string
	url: string
	datePublished: string
	dateModified?: string
	author: {
		name: string
		url?: string
	}
	publisher: {
		name: string
		logo?: string
		url?: string
	}
	image?: string
	description?: string
	wordCount?: number
	articleBody?: string
	keywords?: string[]
	articleSection?: string
}

export default function ArticleSchema({ 
	headline,
	url,
	datePublished,
	dateModified,
	author,
	publisher,
	image,
	description,
	wordCount,
	articleBody,
	keywords,
	articleSection
}: ArticleSchemaProps) {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline,
		url,
		datePublished,
		dateModified: dateModified || datePublished,
		author: {
			'@type': 'Person',
			...author
		},
		publisher: {
			'@type': 'Organization',
			...publisher
		},
		...(image && { 
			image: {
				'@type': 'ImageObject',
				url: image
			}
		}),
		...(description && { description }),
		...(wordCount && { wordCount }),
		...(articleBody && { articleBody }),
		...(keywords && { keywords }),
		...(articleSection && { articleSection }),
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': url
		}
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	)
} 