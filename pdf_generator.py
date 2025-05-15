from flask import Blueprint, request, jsonify, send_file
from weasyprint import HTML, CSS
import io
import os # Required for path joining

pdf_bp = Blueprint("pdf", __name__, url_prefix="/api/pdf")

# Helper function to generate HTML for the PDF based on template_id and data
def generate_resume_html(template_id, data, colors, fonts):
    # This is a simplified version. In a real app, you'd have more complex HTML generation
    # possibly loading Jinja2 templates or constructing HTML strings based on the template_id.
    # For now, let's assume a generic structure and try to use Tailwind-like classes if possible,
    # but WeasyPrint works best with explicit CSS.

    # Define some basic CSS that WeasyPrint can use. 
    # Tailwind classes won't work directly here unless you process them into a CSS string.
    # For ATS-friendly, simple, semantic HTML is key.
    # Using NotoSansCJK for broader character support as per knowledge base.
    css_string = """
        @font-face {
            font-family: 'NotoSansCJK';
            src: url('file:///usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc');
        }
        body {
            font-family: 'NotoSansCJK', 'Helvetica', 'Arial', sans-serif;
            margin: 20mm;
            font-size: 10pt;
            line-height: 1.5;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: 'NotoSansCJK', 'Helvetica', 'Arial', sans-serif;
            margin-top: 0.8em;
            margin-bottom: 0.4em;
            color: #111;
        }
        h1 { font-size: 24pt; margin-bottom: 0.6em; text-align: center; color: #003366; }
        h2 { font-size: 16pt; border-bottom: 1px solid #003366; padding-bottom: 2px; margin-top: 1.2em; color: #003366;}
        h3 { font-size: 12pt; font-weight: bold; color: #222; }
        p { margin-bottom: 0.5em; }
        ul { list-style-type: disc; margin-left: 20px; }
        .section { margin-bottom: 1em; }
        .experience-item, .education-item { margin-bottom: 0.8em; }
        .job-title { font-weight: bold; }
        .company, .institution { font-style: italic; color: #555; }
        .period { font-size: 9pt; color: #777; }
        .skills-list li { display: inline-block; margin-right: 10px; background-color: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 9pt; }
        .contact-info { text-align: center; margin-bottom: 1em; font-size: 9pt; }
        .summary { text-align: justify; }
    """

    # Basic HTML structure
    html_content = f"""
    <html>
    <head>
        <meta charset=\"UTF-8\">
        <title>Currículo - {data.get('fullName', 'Candidato')}</title>
    </head>
    <body>
        <h1>{data.get('fullName', 'Nome Completo')}</h1>
        <div class='contact-info'>
            {data.get('email', '')} | {data.get('phone', '')}
        </div>

        <div class='section summary'>
            <h2>Resumo Profissional</h2>
            <p>{data.get('summary', '')}</p>
        </div>

        <div class='section experiences'>
            <h2>Experiência Profissional</h2>
    """
    if data.get('experiences'):
        for exp in data['experiences']:
            html_content += f"""
            <div class='experience-item'>
                <h3 class='job-title'>{exp.get('jobTitle', '')}</h3>
                <p class='company'>{exp.get('company', '')} | <span class='period'>{exp.get('period', '')}</span></p>
            </div>
            """
    html_content += "</div>"

    html_content += """
        <div class='section education'>
            <h2>Educação</h2>
    """
    if data.get('education'):
        for edu in data['education']:
            html_content += f"""
            <div class='education-item'>
                <h3>{edu.get('course', '')}</h3>
                <p class='institution'>{edu.get('institution', '')} | <span class='period'>{edu.get('period', '')}</span></p>
            </div>
            """
    html_content += "</div>"

    html_content += """
        <div class='section skills'>
            <h2>Habilidades</h2>
            <ul class='skills-list'>
    """
    if data.get('skills'):
        for skill in data['skills'].split(','):
            html_content += f"<li>{skill.strip()}</li>"
    html_content += """
            </ul>
        </div>
    </body>
    </html>
    """
    return html_content, css_string

@pdf_bp.route("/generate", methods=["POST"])
def generate_pdf_route():
    try:
        payload = request.json
        resume_data = payload.get("resumeData")
        template_id = payload.get("templateId", "template1") # Default to template1 if not specified
        # Colors and fonts can be passed in payload if customization is implemented
        colors = payload.get("colors") 
        fonts = payload.get("fonts")

        if not resume_data:
            return jsonify({"error": "Dados do currículo ausentes"}), 400

        html_content, css_string = generate_resume_html(template_id, resume_data, colors, fonts)
        
        # Use WeasyPrint to generate PDF
        # The CSS object can take a string or a list of CSS files.
        # For font paths to work correctly with WeasyPrint, they often need to be absolute file:// URLs
        # or ensure the font is discoverable by Fontconfig on the system.
        # The create_flask_app template might not have Fontconfig fully set up for custom fonts in WeasyPrint by default.
        # Using a system-installed font like NotoSansCJK is safer.
        css = CSS(string=css_string)
        pdf_bytes = HTML(string=html_content).write_pdf(stylesheets=[css])
        
        pdf_io = io.BytesIO(pdf_bytes)
        pdf_io.seek(0)

        return send_file(
            pdf_io,
            mimetype="application/pdf",
            as_attachment=True,
            download_name=f"curriculo_{resume_data.get('fullName', 'candidato').replace(' ', '_')}.pdf"
        )

    except Exception as e:
        print(f"Error generating PDF: {e}") # Log to server console
        return jsonify({"error": f"Erro ao gerar PDF: {str(e)}"}), 500

