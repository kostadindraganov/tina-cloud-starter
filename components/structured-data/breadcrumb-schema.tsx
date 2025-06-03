interface BreadcrumbItem {
	name: string
	url: string
	position: number
}

interface BreadcrumbSchemaProps {
	breadcrumbs: BreadcrumbItem[]
}

export default function BreadcrumbSchema({ breadcrumbs }: BreadcrumbSchemaProps) {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbs.map(item => ({
			'@type': 'ListItem',
			position: item.position,
			name: item.name,
			item: item.url
		}))
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	)
} 