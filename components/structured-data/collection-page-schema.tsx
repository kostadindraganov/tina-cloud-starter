interface CollectionItem {
	name: string
	url: string
	description?: string
	image?: string
}

interface CollectionPageSchemaProps {
	name: string
	description: string
	url: string
	numberOfItems?: number
	items?: CollectionItem[]
	provider?: {
		name: string
		url?: string
	}
}

export default function CollectionPageSchema({ 
	name,
	description,
	url,
	numberOfItems,
	items,
	provider
}: CollectionPageSchemaProps) {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name,
		description,
		url,
		...(numberOfItems && { numberOfItems }),
		...(provider && {
			provider: {
				'@type': 'Organization',
				...provider
			}
		}),
		...(items && {
			mainEntity: {
				'@type': 'ItemList',
				itemListElement: items.map((item, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'Thing',
						name: item.name,
						url: item.url,
						...(item.description && { description: item.description }),
						...(item.image && { image: item.image })
					}
				}))
			}
		})
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	)
} 