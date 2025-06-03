interface BlogPost {
	headline: string
	url: string
	datePublished: string
	dateModified?: string
	author: {
		name: string
		url?: string
	}
	image?: string
	description?: string
}

interface BlogSchemaProps {
	name: string
	description: string
	url: string
	posts: BlogPost[]
	publisher: {
		name: string
		logo?: string
	}
}

export default function BlogSchema({ 
	name, 
	description, 
	url, 
	posts,
	publisher
}: BlogSchemaProps) {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name,
		description,
		url,
		publisher: {
			'@type': 'Organization',
			...publisher
		},
		blogPost: posts.map(post => ({
			'@type': 'BlogPosting',
			headline: post.headline,
			url: post.url,
			datePublished: post.datePublished,
			...(post.dateModified && { dateModified: post.dateModified }),
			author: {
				'@type': 'Person',
				...post.author
			},
			...(post.image && { image: post.image }),
			...(post.description && { description: post.description }),
			publisher: {
				'@type': 'Organization',
				...publisher
			}
		}))
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	)
} 