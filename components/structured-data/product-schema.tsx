interface ProductReview {
	author: string
	datePublished: string
	reviewBody: string
	reviewRating: {
		ratingValue: number
		bestRating: number
	}
}

interface ProductSchemaProps {
	name: string
	description: string
	url?: string
	image?: string
	brand?: string
	category?: string
	aggregateRating?: {
		ratingValue: number
		reviewCount: number
		bestRating?: number
		worstRating?: number
	}
	reviews?: ProductReview[]
	offers?: {
		price?: string
		priceCurrency?: string
		availability?: string
		validFrom?: string
		validThrough?: string
	}
}

export default function ProductSchema({ 
	name,
	description,
	url,
	image,
	brand,
	category,
	aggregateRating,
	reviews,
	offers
}: ProductSchemaProps) {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name,
		description,
		...(url && { url }),
		...(image && { image }),
		...(brand && { brand: { '@type': 'Brand', name: brand } }),
		...(category && { category }),
		...(aggregateRating && {
			aggregateRating: {
				'@type': 'AggregateRating',
				ratingValue: aggregateRating.ratingValue,
				reviewCount: aggregateRating.reviewCount,
				bestRating: aggregateRating.bestRating || 5,
				worstRating: aggregateRating.worstRating || 1
			}
		}),
		...(reviews && {
			review: reviews.map(review => ({
				'@type': 'Review',
				author: {
					'@type': 'Person',
					name: review.author
				},
				datePublished: review.datePublished,
				reviewBody: review.reviewBody,
				reviewRating: {
					'@type': 'Rating',
					ratingValue: review.reviewRating.ratingValue,
					bestRating: review.reviewRating.bestRating
				}
			}))
		}),
		...(offers && {
			offers: {
				'@type': 'Offer',
				...(offers.price && { price: offers.price }),
				...(offers.priceCurrency && { priceCurrency: offers.priceCurrency }),
				...(offers.availability && { availability: `https://schema.org/${offers.availability}` }),
				...(offers.validFrom && { validFrom: offers.validFrom }),
				...(offers.validThrough && { validThrough: offers.validThrough })
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