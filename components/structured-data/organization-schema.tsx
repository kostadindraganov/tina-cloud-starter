interface OrganizationSchemaProps {
	name: string
	url: string
	logo?: string
	description?: string
	socialMedia?: string[]
	contactPoint?: {
		telephone?: string
		contactType?: string
		email?: string
	}
}

export default function OrganizationSchema({ 
	name, 
	url, 
	logo, 
	description,
	socialMedia,
	contactPoint
}: OrganizationSchemaProps) {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name,
		url,
		...(logo && { logo }),
		...(description && { description }),
		...(socialMedia && { sameAs: socialMedia }),
		...(contactPoint && { contactPoint: {
			'@type': 'ContactPoint',
			...contactPoint
		}})
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	)
} 