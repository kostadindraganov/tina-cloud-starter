interface LocalBusinessSchemaProps {
	name: string
	description: string
	url: string
	logo?: string
	telephone?: string
	email?: string
	address?: {
		streetAddress?: string
		addressLocality?: string
		addressRegion?: string
		postalCode?: string
		addressCountry?: string
	}
	geo?: {
		latitude: number
		longitude: number
	}
	openingHours?: string[]
	priceRange?: string
	paymentAccepted?: string[]
	socialMedia?: string[]
}

export default function LocalBusinessSchema({ 
	name,
	description,
	url,
	logo,
	telephone,
	email,
	address,
	geo,
	openingHours,
	priceRange,
	paymentAccepted,
	socialMedia
}: LocalBusinessSchemaProps) {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		name,
		description,
		url,
		...(logo && { logo }),
		...(telephone && { telephone }),
		...(email && { email }),
		...(address && {
			address: {
				'@type': 'PostalAddress',
				...address
			}
		}),
		...(geo && {
			geo: {
				'@type': 'GeoCoordinates',
				latitude: geo.latitude,
				longitude: geo.longitude
			}
		}),
		...(openingHours && { openingHours }),
		...(priceRange && { priceRange }),
		...(paymentAccepted && { paymentAccepted }),
		...(socialMedia && { sameAs: socialMedia })
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	)
} 